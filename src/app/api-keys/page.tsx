'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ApiKey {
  id: string;
  keyName: string;
  scopes: string[];
  tier: string;
  metadata: {
    createdAt: string;
    lastUsed: string | null;
    isActive: boolean;
    expiresAt: string | null;
  };
  usage: {
    totalRequests: number;
    dailyLimit: number;
    monthlyLimit: number;
    requestsToday: number;
  };
  keyPreview: string;
  plainKey?: string; // Store plain key temporarily after creation
}

const AVAILABLE_SCOPES = [
  { value: 'scan:file', label: 'File Scanning', description: 'Scan PE files for malware' },
  { value: 'scan:url', label: 'URL Scanning', description: 'Scan URLs for threats' },
  { value: 'reports:read', label: 'Read Reports', description: 'Access scan reports' },
  { value: 'reports:write', label: 'Write Reports', description: 'Create scan reports' },
];

export default function ApiKeysPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ apiKey: string } | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set()); // Track which keys are visible
  const [showRevoked, setShowRevoked] = useState(false); // Toggle to show/hide revoked keys
  const [copiedCode, setCopiedCode] = useState<string | null>(null); // Track which code block was copied

  // Form state
  const [keyName, setKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['scan:file', 'scan:url']);
  const [tier, setTier] = useState('FREE');
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    } else if (user) {
      loadApiKeys();
    }
  }, [user, authLoading, router]);

  // Load plain keys from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('neuroshield_api_keys');
      if (stored) {
        const plainKeys = JSON.parse(stored);
        // Merge with existing keys
        setKeys(prevKeys => prevKeys.map(key => ({
          ...key,
          plainKey: plainKeys[key.id] || key.plainKey
        })));
      }
    } catch (e) {
      console.error('Error loading stored keys:', e);
    }
  }, []);

  const loadApiKeys = async () => {
    try {
      const idToken = await user?.getIdToken();
      
      if (!idToken) {
        console.error('No ID token available');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/keys/list', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to load API keys');
      }

      const data = await response.json();
      setKeys(data.keys || []);
    } catch (error: any) {
      console.error('Error loading API keys:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load API keys',
        variant: 'destructive',
      });
      // Set empty array so UI shows "No API Keys Yet" instead of error
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!keyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a key name',
        variant: 'destructive',
      });
      return;
    }

    if (selectedScopes.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one scope',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          keyName,
          scopes: selectedScopes,
          tier,
          expiresInDays,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create API key');
      }

      const data = await response.json();
      
      // Set the new key data to show success message
      setNewKeyData({ apiKey: data.apiKey });
      
      // Mark newly created key with plain key for display
      if (data.apiKey) {
        const newKey = {
          id: data.keyId,
          keyName: data.keyName,
          scopes: data.scopes,
          tier: data.tier,
          metadata: {
            createdAt: new Date().toISOString(),
            lastUsed: null,
            isActive: true,
            expiresAt: data.expiresAt,
          },
          usage: {
            totalRequests: 0,
            dailyLimit: data.dailyLimit,
            monthlyLimit: data.monthlyLimit,
            requestsToday: 0,
          },
          keyPreview: `...${data.apiKey.slice(-8)}`,
          plainKey: data.apiKey, // Store temporarily
        };
        
        // Store in sessionStorage for persistence
        try {
          const stored = sessionStorage.getItem('neuroshield_api_keys');
          const plainKeys = stored ? JSON.parse(stored) : {};
          plainKeys[data.keyId] = data.apiKey;
          sessionStorage.setItem('neuroshield_api_keys', JSON.stringify(plainKeys));
        } catch (e) {
          console.error('Error storing key:', e);
        }
        
        setKeys(prevKeys => [newKey, ...prevKeys]);
        setVisibleKeys(prev => new Set(prev).add(data.keyId)); // Auto-show new key
      } else {
        // Reload all keys if no key returned
        await loadApiKeys();
      }

      // Don't show toast here - the success view in dialog is enough
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const idToken = await user?.getIdToken();
      const response = await fetch('/api/keys/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ keyId }),
      });

      if (!response.ok) {
        throw new Error('Failed to revoke API key');
      }

      // Update the key in state to show as revoked
      setKeys(prevKeys => 
        prevKeys.map(key => 
          key.id === keyId 
            ? { ...key, metadata: { ...key.metadata, isActive: false } }
            : key
        )
      );

      // Remove from sessionStorage
      try {
        const stored = sessionStorage.getItem('neuroshield_api_keys');
        if (stored) {
          const plainKeys = JSON.parse(stored);
          delete plainKeys[keyId];
          sessionStorage.setItem('neuroshield_api_keys', JSON.stringify(plainKeys));
        }
      } catch (e) {
        console.error('Error removing key from storage:', e);
      }

      toast({
        title: 'Success',
        description: 'API key revoked successfully',
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `API key "${keyName}" copied to clipboard`,
      duration: 1500,
    });
  };

  const copyCodeBlock = (code: string, blockId: string, description: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(blockId);
    toast({
      title: 'Copied',
      description: `${description} copied to clipboard`,
      duration: 1500,
    });
    // Reset after 2 seconds
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (authLoading || loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-spin" style={{ animationDuration: '3s' }} />
            
            {/* Middle pulsing ring */}
            <div className="absolute inset-2 rounded-full border-4 border-pink-500/30 animate-pulse" />
            
            {/* Inner spinning icon */}
            <div className="relative p-8">
              <Key className="h-12 w-12 text-purple-400 animate-pulse" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Loading API Keys
            </p>
            <p className="text-sm text-muted-foreground">
              Securing your credentials...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6 md:gap-8">
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">API Keys</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage your NeuroShield API keys for programmatic access
          </p>
        </header>

        <div className="flex items-center justify-end mb-4 gap-4">
          {/* Toggle for showing revoked keys */}
          {keys.some(k => !k.metadata.isActive) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRevoked(!showRevoked)}
              className="border-purple-500/20"
            >
              {showRevoked ? 'Hide' : 'Show'} Revoked Keys ({keys.filter(k => !k.metadata.isActive).length})
            </Button>
          )}
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0">
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for programmatic access to NeuroShield
              </DialogDescription>
            </DialogHeader>

            {newKeyData ? (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-500">API Key Created!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your key is now active and ready to use. You can view and copy it anytime from the list below.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Your New API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyData.apiKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(newKeyData.apiKey, 'New Key')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This key is also visible in your API keys list below with the eye icon.
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    setNewKeyData(null);
                    setShowCreateDialog(false);
                    // Reset form
                    setKeyName('');
                    setSelectedScopes(['scan:file', 'scan:url']);
                    setTier('FREE');
                    setExpiresInDays(null);
                  }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="Production API Key"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    {AVAILABLE_SCOPES.map((scope) => (
                      <div key={scope.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={scope.value}
                          checked={selectedScopes.includes(scope.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedScopes([...selectedScopes, scope.value]);
                            } else {
                              setSelectedScopes(selectedScopes.filter(s => s !== scope.value));
                            }
                          }}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={scope.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {scope.label}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {scope.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tier">Rate Limit Tier</Label>
                  <Select value={tier} onValueChange={setTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">Free (100/day, 1K/month)</SelectItem>
                      <SelectItem value="PRO">Pro (1K/day, 20K/month)</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise (10K/day, 200K/month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires">Expires In (days, optional)</Label>
                  <Input
                    id="expires"
                    type="number"
                    placeholder="Never expires"
                    value={expiresInDays || ''}
                    onChange={(e) => setExpiresInDays(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateDialog(false);
                      // Reset form when canceling
                      setKeyName('');
                      setSelectedScopes(['scan:file', 'scan:url']);
                      setTier('FREE');
                      setExpiresInDays(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createApiKey}
                    disabled={creating}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {creating ? 'Creating...' : 'Create Key'}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="grid gap-4">
        {keys.filter(k => showRevoked || k.metadata.isActive).length === 0 ? (
          <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-purple-500/10 p-4 mb-4">
                <Key className="h-12 w-12 text-purple-400" />
              </div>
              <p className="text-lg font-semibold mb-2">
                {keys.length > 0 ? 'No Active API Keys' : 'No API Keys Yet'}
              </p>
              <p className="text-muted-foreground text-center mb-4">
                {keys.length > 0 
                  ? 'All your API keys have been revoked. Create a new one to continue.'
                  : 'Create your first API key to start integrating NeuroShield into your applications'
                }
              </p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </CardContent>
          </Card>
        ) : (
          keys
            .filter(key => showRevoked || key.metadata.isActive) // Filter based on toggle
            .map((key) => {
            const isVisible = visibleKeys.has(key.id);
            const displayKey = key.plainKey || key.keyPreview;
            
            return (
            <Card key={key.id} className={`border-purple-500/20 bg-black/40 backdrop-blur-sm ${!key.metadata.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {key.keyName}
                      {!key.metadata.isActive && (
                        <Badge variant="destructive">Revoked</Badge>
                      )}
                      <Badge variant="outline">{key.tier}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <code className="font-mono text-xs bg-black/60 border border-purple-500/20 px-2 py-1 rounded text-purple-300">
                          {isVisible && key.plainKey ? key.plainKey : (isVisible ? displayKey : '••••••••••••••••••••••••••••••••')}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleKeyVisibility(key.id)}
                          title={key.plainKey ? "Toggle visibility" : "Full key not available (only last 8 characters shown)"}
                        >
                          {isVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            if (key.plainKey) {
                              copyToClipboard(key.plainKey, key.keyName);
                            } else {
                              toast({
                                title: 'Full key not available',
                                description: 'The full API key is only available right after creation. Please create a new key if needed.',
                                variant: 'destructive',
                                duration: 4000,
                              });
                            }
                          }}
                          title={key.plainKey ? "Copy full key" : "Full key not available"}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardDescription>
                    {!key.plainKey && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-amber-500/80">
                        <div className="h-1 w-1 rounded-full bg-amber-500" />
                        <span>Preview only - full key available after creation</span>
                      </div>
                    )}
                  </div>
                  {key.metadata.isActive && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => revokeApiKey(key.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Requests Today</p>
                    <p className="text-2xl font-bold">
                      {key.usage.requestsToday}/{key.usage.dailyLimit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">{key.usage.totalRequests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(key.metadata.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Used</p>
                    <p className="text-sm font-medium">
                      {key.metadata.lastUsed 
                        ? new Date(key.metadata.lastUsed).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {key.scopes.map((scope) => (
                    <Badge key={scope} variant="secondary">
                      {scope}
                    </Badge>
                  ))}
                </div>

                {key.metadata.expiresAt && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-yellow-500">
                    <Clock className="h-4 w-4" />
                    Expires on {new Date(key.metadata.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
            );
          })
        )}
      </div>

      {/* Documentation */}
      <Card className="mt-8 border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            API Documentation
          </CardTitle>
          <CardDescription className="text-gray-300">
            How to use your API keys with NeuroShield
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-lg text-purple-200">Authentication</h3>
            <p className="text-sm text-gray-300 mb-3">
              Include your API key in the request header:
            </p>
            <pre className="bg-black/80 border border-purple-400/30 p-4 rounded-lg text-sm overflow-x-auto shadow-lg">
              <code className="text-green-400 font-mono">x-api-key: ns_live_your_api_key_here</code>
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-lg text-purple-200">Scan File Endpoint</h3>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const code = `POST /api/v1/scan/file
Content-Type: application/json
x-api-key: ns_live_your_api_key_here

{
  "fileDataUri": "data:application/octet-stream;base64,...",
  "fileName": "suspicious.exe"
}`;
                  copyCodeBlock(code, 'file-endpoint', 'File endpoint example');
                }}
                className={`absolute top-2 right-2 z-10 backdrop-blur-sm transition-colors ${
                  copiedCode === 'file-endpoint' 
                    ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20' 
                    : 'text-purple-300 hover:text-purple-200 hover:bg-purple-500/20'
                }`}
              >
                {copiedCode === 'file-endpoint' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <pre className="bg-black/80 border border-purple-400/30 p-4 rounded-lg text-sm overflow-x-auto shadow-lg">
                <code className="text-gray-100 font-mono whitespace-pre">{`POST /api/v1/scan/file
Content-Type: application/json
x-api-key: ns_live_your_api_key_here

{
  "fileDataUri": "data:application/octet-stream;base64,...",
  "fileName": "suspicious.exe"
}`}</code>
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-lg text-purple-200">Scan URL Endpoint</h3>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const code = `POST /api/v1/scan/url
Content-Type: application/json
x-api-key: ns_live_your_api_key_here

{
  "url": "https://example.com"
}`;
                  copyCodeBlock(code, 'url-endpoint', 'URL endpoint example');
                }}
                className={`absolute top-2 right-2 z-10 backdrop-blur-sm transition-colors ${
                  copiedCode === 'url-endpoint' 
                    ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20' 
                    : 'text-purple-300 hover:text-purple-200 hover:bg-purple-500/20'
                }`}
              >
                {copiedCode === 'url-endpoint' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <pre className="bg-black/80 border border-purple-400/30 p-4 rounded-lg text-sm overflow-x-auto shadow-lg">
                <code className="text-gray-100 font-mono whitespace-pre">{`POST /api/v1/scan/url
Content-Type: application/json
x-api-key: ns_live_your_api_key_here

{
  "url": "https://example.com"
}`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </AppShell>
  );
}

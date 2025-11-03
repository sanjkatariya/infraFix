import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isIOSDevice) {
      setIsIOS(true);
      // Show iOS instructions if not already installed
      if (!isIOSStandalone) {
        const hasSeenIOSPrompt = localStorage.getItem('infrafix-ios-prompt-seen');
        if (!hasSeenIOSPrompt) {
          setTimeout(() => setShowPrompt(true), 3000);
        }
      } else {
        setIsInstalled(true);
      }
    }

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Check if user has dismissed before
      const hasDismissed = localStorage.getItem('infrafix-install-dismissed');
      if (!hasDismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('infrafix-install-dismissed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('infrafix-install-dismissed');
    } else {
      localStorage.setItem('infrafix-install-dismissed', 'true');
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('infrafix-ios-prompt-seen', 'true');
    } else {
      localStorage.setItem('infrafix-install-dismissed', 'true');
    }
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 transition-all duration-300 ease-in-out">
      <Card className="p-4 shadow-lg border-2 border-primary">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">🛠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Install InfraFix</h3>
              <p className="text-xs text-gray-600">Get the app experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Install InfraFix on your iPhone/iPad for a better experience:
            </p>
            <ol className="text-xs text-gray-600 space-y-1.5 ml-4 list-decimal">
              <li>Tap the <span className="font-semibold">Share</span> button <span className="text-base">📤</span></li>
              <li>Scroll down and tap <span className="font-semibold">Add to Home Screen</span></li>
              <li>Tap <span className="font-semibold">Add</span> to confirm</li>
            </ol>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Got it
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Install InfraFix on your device for quick access and offline support:
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Smartphone className="w-4 h-4" />
              <span>Works on mobile & desktop</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Monitor className="w-4 h-4" />
              <span>Faster loading & offline access</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
              >
                Later
              </Button>
              <Button
                onClick={handleInstall}
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function TestBookingPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/test-booking');
      const data = await response.json();
      
      setResult(data);
      
      if (!data.success) {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Booking Process</CardTitle>
          <p className="text-sm text-muted-foreground">
            This page creates a test booking with sample data to verify the booking system works correctly.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={runTest}
            disabled={loading}
            className="w-full"
          >
            {loading ? <LoadingSpinner className="mr-2" /> : null}
            Run Test
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              <h3 className="font-semibold mb-2">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {result.success && (
                <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Success!</h3>
                  <p>Test booking was created successfully.</p>
                </div>
              )}

              <div className="p-4 bg-accent rounded-lg">
                <h3 className="font-semibold mb-2">Debug Steps</h3>
                <ul className="space-y-1 list-disc list-inside">
                  {result.debug.steps.map((step: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.bookingData && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Booking Data</h3>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(result.bookingData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
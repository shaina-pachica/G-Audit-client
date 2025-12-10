'use client';

import type React from 'react';

import { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface EnterDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: any) => void;
}

export function EnterDataModal({
  isOpen,
  onClose,
  onSubmit,
}: EnterDataModalProps) {
  const [formData, setFormData] = useState({
    type: 'inbound',
    amount: '',
    reference: '',
    description: '',
    transferFrom: '',
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.amount ||
        !formData.reference ||
        !formData.description ||
        !formData.transferFrom
      ) {
        throw new Error('Please fill in all fields');
      }

      if (isNaN(Number.parseFloat(formData.amount))) {
        throw new Error('Amount must be a valid number');
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new transaction
      const newTransaction = {
        id: `txn-${Date.now()}`,
        type: formData.type as 'inbound' | 'outbound',
        amount: Number.parseFloat(formData.amount),
        reference: formData.reference,
        description: formData.description,
        transferFrom: formData.transferFrom,
        date: new Date().toISOString(),
        balance: Math.random() * 50000,
      };

      onSubmit(newTransaction);

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Transaction added successfully!',
      });

      // Reset form
      setFormData({
        type: 'inbound',
        amount: '',
        reference: '',
        description: '',
        transferFrom: '',
      });

      // Close modal after delay
      setTimeout(() => {
        onClose();
        setNotification(null);
      }, 2000);
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to add transaction. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <Card className="w-full max-w-md bg-background border-white/20 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold">Enter Transaction Data</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 animate-slide-up ${
                notification.type === 'success'
                  ? 'bg-primary/10 border border-primary text-primary'
                  : 'bg-destructive/10 border border-destructive text-destructive'
              }`}
            >
              {notification.type === 'success' ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-sm">{notification.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Transaction Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              >
                <option value="inbound">Inbound (Money In)</option>
                <option value="outbound">Outbound (Money Out)</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="bg-white/10 border-white/20 focus:ring-accent"
                required
              />
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Reference #
              </label>
              <Input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="e.g., INV-001"
                className="bg-white/10 border-white/20 focus:ring-accent"
                required
              />
            </div>

            {/* Transfer From */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Transfer From
              </label>
              <Input
                type="text"
                name="transferFrom"
                value={formData.transferFrom}
                onChange={handleChange}
                placeholder="e.g., GCash 09171234567 or Card ending in 5408"
                className="bg-white/10 border-white/20 focus:ring-accent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Client payment for services"
                className="bg-white/10 border-white/20 focus:ring-accent"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-white/5 border-white/20 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-accent hover:bg-accent/90"
              >
                {isSubmitting ? 'Adding...' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

interface SimpleModalProps {
  ownerEmail: string;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ ownerEmail }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerEmail,
          senderName: name,
          senderEmail: email,
          message,
        })
      });

      if (response.ok) {
        toast.success("Feedback sent successfully");
        setOpen(false);  // Close the modal
      } else {
        toast.error('Failed to send feedback');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}> {/* Ensure the `open` state controls the modal */}
      <DialogTrigger asChild>
        <Button variant="ghost" className="ml-2">
          <Mail className="w-4 h-4 inline-block" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Feedback to the Teacher</DialogTitle>
        </DialogHeader>

        {/* Form Fields */}
        <div className="space-y-4">
          <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea placeholder="Your Feedback" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Send Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleModal;

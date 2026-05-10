import { useState } from "react";
import StarRating from "@/components/common/StarRating";
import Button from "@/components/common/Button";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ rating, text });
    setText("");
  };

  return (
    <form onSubmit={submit} className="rounded-2xl bg-card border border-border p-5 space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">How was the job?</p>
        <StarRating value={rating} onChange={setRating} interactive showNumber={false} size={28} />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Share a few words about your experience"
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button type="submit">Post review</Button>
    </form>
  );
}

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/providers/authContext"
import useElysiaClient from "@/providers/elysiaProvider"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

export default function CreateApiModal({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (val: boolean) => void
}) {
  const [name, setName] = useState("")
  const client = useElysiaClient()
  const { token } = useAuth();
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      return await client.api.v1.apikey.create.post(
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    },
    onSuccess: () => {
      toast.success("API key created successfully");
      queryClient.invalidateQueries({queryKey: ["dashboard"]})
      setName("")
      setOpen(false)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create API key")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter a name")
      return
    }

    mutation.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm bg-zinc-900 border border-white/10 text-white shadow-xl rounded-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">
              Generate OpenRouter API Key
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Create a new API key for authenticating requests. Store it
              securely—this key will only be shown once.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-4 space-y-2">
            <Field>
              <Label className="text-zinc-300" htmlFor="name">
                Name
              </Label>
              <Input
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-white/20"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My First Key"
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4 flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
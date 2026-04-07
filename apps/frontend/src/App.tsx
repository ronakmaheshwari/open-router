import { treaty } from "@elysiajs/eden/treaty2";
import "./index.css";
import type {App} from "primary-backend";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

const client = treaty<App>('localhost:3000')


export function App() {
  const [name, setName] = useState<string>("");
  const [email,setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("")

  async function Signup() {
    const res = await client.api.v1.auth["signup"].post({
      name: `${name}`, 
      email: `${email}`, 
      password: `${password}`
    })

    if(res.status === 201) {
      const token = res.data?.token;
      const message = res.data?.message;
      if (token) {
        localStorage.setItem("token", token);
      }
      toast.success(message)
    } else {
      toast.error("Signup failed")
    }
  }

  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-gray-200">
  <Toaster />

  <div className="w-[400px] border border-gray-400 bg-amber-50 p-6 rounded-md flex flex-col gap-6">
    
    <div className="w-full flex flex-col gap-4">
      <Input 
        placeholder="Enter your username" 
        type="text" 
        onChange={(e) => {setName(e.target.value)}} 
      />
      <Input 
        placeholder="Enter your email" 
        type="text" 
        onChange={(e) => {setEmail(e.target.value)}} 
      />
      <Input 
        placeholder="Enter your password" 
        type="text" 
        onChange={(e) => {setPassword(e.target.value)}} 
      />
    </div>

    <div className="w-full flex justify-center">
      <Button 
        variant="outline" 
        title="Submit" 
        className="w-full h-12"  
        onClick={() => { Signup() }}
      >Submit</Button>
    </div>

  </div>
</div>
  );
}

export default App;

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { closeModel } from "@/store/slices/modelSlice";
import Axios from "@/lib/ApiConfig";

const InvitePartnerModal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [Loading, SetLoading] = useState(false);
  const [email, setEmail] = useState("");

  const { type, isOpen } = useSelector((state: RootState) => state.model);

  const isModalOpen = isOpen && type === "invite-partner";

  const handleModelClose = () => dispatch(closeModel());

  const handleInvite = async () => {
    SetLoading(true);
    try {
      await Axios.post(`cases/${user.inviteCaseId}/invite`, { email });
    } catch (error) {
      console.log("Error sending invitation:", error);
    } finally {
      SetLoading(false);
      handleModelClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModelClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-4 px-6">
          <DialogTitle className="text-2xl text-center font-semibold">
            Invite Partner
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Label className="uppercase text-sm font-medium text-zinc-500 px-2">
            Partner Email:
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-200/50 rounded-sm selection:bg-blue-600 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
            />
          </div>
          <Button
            size="sm"
            className=" mt-6 cursor-pointer px-5 text-white font-normal"
            disabled={Loading}
            onClick={handleInvite}
          >
            {Loading ? "Sending Invitation ..." : "Send Invitation"}
            {Loading && <RefreshCw className="w-4 h-4 ml-3 animate-spin text-white"/> }
            
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePartnerModal;

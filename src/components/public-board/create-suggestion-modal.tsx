import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useMediaQuery } from "~/hooks/use-media-query";
import { Button } from "../ui/button";
import { CreateSuggestionForm } from "../dashboard/create-suggestion-form";
import { memo, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

const animationVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

interface CreateSuggestionModalProps {
  readonly boardId: number;
}

export const CreateSuggestionModal = memo(
  ({ boardId }: CreateSuggestionModalProps) => {
    const session = useSession();
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <AnimatePresence>
            {session.status === "authenticated" ? (
              <motion.div
                key="create-suggestion-modal"
                variants={animationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="fixed bottom-4 left-0 right-0 flex justify-center"
              >
                <DialogTrigger asChild>
                  <Button variant="default">Create Suggestion</Button>
                </DialogTrigger>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Suggestion</DialogTitle>
            </DialogHeader>
            <CreateSuggestionForm boardId={boardId} />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {session.status === "authenticated" ? (
            <motion.div
              key="create-suggestion-modal"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="fixed bottom-4 left-0 right-0 flex justify-center"
            >
              <DrawerTrigger asChild>
                <Button variant="default">Create Suggestion</Button>
              </DrawerTrigger>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Create Suggestion</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <CreateSuggestionForm boardId={boardId} />
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
);

CreateSuggestionModal.displayName = "CreateSuggestionModal";

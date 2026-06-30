import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full" />
      </div>

      <Card className="w-full max-w-lg border border-border/50 shadow-2xl backdrop-blur-xl bg-background/70">
        <CardContent className="p-10 text-center space-y-6">
          {/* Animated 404 */}
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-8xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text"
          >
            404
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            {getTranslation(t, "errors.notFound.description")}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <Button onClick={() => navigate({ to: "/" })}>
              <Home className="mr-2 h-4 w-4" />
              {getTranslation(t, "errors.notFound.goHome")}
            </Button>

            <Button variant="outline" onClick={() => navigate({ to: -1 })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {getTranslation(t, "errors.notFound.goBack")}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

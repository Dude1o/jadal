import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchX, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface NoItemsProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  showResetButton?: boolean;
}

export default function NoItems({
  title,
  description,
  onReset,
  showResetButton = true,
}: NoItemsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md border border-border/50 bg-background/70 backdrop-blur-xl shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon with subtle animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted"
          >
            <SearchX className="w-8 h-8 text-muted-foreground" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-semibold">{title ?? getTranslation(t, "common.noItems.title")}</h3>
            <p className="text-sm text-muted-foreground">{description ?? getTranslation(t, "common.noItems.description")}</p>
          </motion.div>

          {/* Actions */}
          {onReset && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {showResetButton && (
                <Button variant="outline" onClick={onReset}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {getTranslation(t, "common.actions.clearSearch")}
                </Button>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

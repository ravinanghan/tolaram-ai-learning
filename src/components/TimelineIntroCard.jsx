import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import Button from "./Button";
import { Clock } from "lucide-react";

export default function TimelineIntroCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Timeline: Why AI now?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A convergence of algorithmic advances, data proliferation, and
                tremendous increases in computing power and storage has propelled AI
                from hype to reality.
              </p>
            </div>
          </div>

          {/* Right side */}
          <Button onClick={() => navigate("/ai-timeline")} className="sm:w-auto">
            View AI Timeline
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

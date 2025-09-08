import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginView from "../auth/LoginView";
import SignUpView from "../auth/SignUpView";
import "../styles/CardStyle.css"

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);

  const toggle = () => setIsLogin(prev => !prev);

  return (
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{display: 'flex', width: '100vw'}}
          >
            <LoginView switchToRegister={toggle} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{display: 'flex', width:'100vw'}}
          >
            <SignUpView switchToLogin={toggle} />
          </motion.div>
        )}
      </AnimatePresence>
  );
}

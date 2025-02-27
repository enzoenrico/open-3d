'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User } from "@supabase/supabase-js"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"

interface UserCardProps {
  userObj: User | null;
  defaultOpen?: boolean;
  showPopover?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onLogout?: () => void;
}

function UserCard({
  userObj,
  defaultOpen = false,
  showPopover = true,
  onOpenChange,
  onLogout
}: UserCardProps) {
  // Using two separate states for clarity
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isExpanded, setIsExpanded] = useState(defaultOpen)
  
  // Update internal states when defaultOpen prop changes
  useEffect(() => {
    setIsOpen(defaultOpen)
    setIsExpanded(defaultOpen)
  }, [defaultOpen])
  
  // Handle open state change
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    setIsExpanded(open)
    if (onOpenChange) {
      onOpenChange(open)
    }
  }
  
  // Animation variants
  const cardVariants = {
    collapsed: {
      width: "51px",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    expanded: {
      width: "auto",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }
  
  const textVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.1, duration: 0.3 }
    }
  }
  
  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsExpanded(true)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!isOpen) {
      setIsExpanded(false)
    }
  }
  
  // Just the card without popover
  if (!showPopover) {
    return (
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={defaultOpen ? "expanded" : "collapsed"}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={cardVariants}
        className="cursor-pointer"
      >
        <Card className={`rounded-full overflow-hidden border-2 transition-shadow ${defaultOpen ? 'border-primary shadow-md' : 'hover:border-primary hover:shadow-md'}`}>
          <CardContent className="flex items-center justify-start px-1 py-1 gap-2 whitespace-nowrap">
            <Avatar className="border-2 border-black/10">
              <AvatarImage src={userObj?.user_metadata?.picture} />
              <AvatarFallback>
                {userObj?.user_metadata?.name?.substring(0, 2) || "UN"}
              </AvatarFallback>
            </Avatar>
            
            <motion.p
              variants={textVariants}
              initial={defaultOpen ? "visible" : "hidden"}
              animate={isExpanded ? "visible" : "hidden"}
              className="font-medium"
            >
              Olá, {userObj?.user_metadata?.name?.split(' ')[0] || "Usuario"}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }
  
  // Card with popover
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          initial={defaultOpen ? "expanded" : "collapsed"}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={cardVariants}
          className="cursor-pointer"
        >
          <Card className={`rounded-full overflow-hidden border-2 transition-shadow ${isOpen || defaultOpen ? 'border-primary shadow-md' : 'hover:border-primary hover:shadow-md'}`}>
            <CardContent className="flex items-center justify-start px-1 py-1 gap-2 whitespace-nowrap">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar className="border-2 border-black/10">
                  <AvatarImage src={userObj?.user_metadata?.picture} />
                  <AvatarFallback>
                    {userObj?.user_metadata?.name?.substring(0, 2) || "UN"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <motion.p
                variants={textVariants}
                initial={defaultOpen ? "visible" : "hidden"}
                animate={isExpanded ? "visible" : "hidden"}
                className="font-medium"
              >
                Olá, {userObj?.user_metadata?.name?.split(' ')[0] || "Usuario"}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </PopoverTrigger>
      
      <PopoverContent className="w-56">
        {/* ...rest of your popover content... */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={userObj?.user_metadata?.picture} />
              <AvatarFallback>{userObj?.user_metadata?.name?.substring(0, 2) || "UN"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userObj?.user_metadata?.name}</p>
              <p className="text-xs text-muted-foreground">{userObj?.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full">Perfil</Button>
            <Button variant="outline" size="sm" className="w-full">Configurações</Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={onLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default UserCard
'use client';

import { useState } from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ThemeToggle } from './theme-toggle';
import { Scissors, Menu, Package } from 'lucide-react';
import { Button } from './ui/button';
import NavLink from './NavLink';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex items-center space-x-2">
              <NavLink href="/" className="flex items-center space-x-2">
                <Scissors className="h-6 w-6" />
                <span className="text-xl font-bold hidden md:inline">Meliyah afro-shop</span>
                <span className="text-xl font-bold md:hidden">Meliyah</span>
              </NavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/booking">Termin buchen</NavLink>
          <NavLink href="/products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Produkte</span>
          </NavLink>
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <NavLink href="/" onClick={() => setIsOpen(false)}>
                  Home
                </NavLink>
                <NavLink href="/booking" onClick={() => setIsOpen(false)}>
                  Termin buchen
                </NavLink>
                <NavLink href="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Produkte</span>
                </NavLink>
                <div className="mt-4">
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
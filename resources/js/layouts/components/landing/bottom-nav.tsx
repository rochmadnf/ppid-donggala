import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import type { DrawerProps } from '@/layouts/types';

export function BottomNav({ openDrawer, setOpenDrawer }: DrawerProps) {
    return (
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
            <DrawerContent>
                <h5 className="mt-4 px-4 font-bold">Menu</h5>

                <DrawerFooter>{/* Ongoing */}</DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

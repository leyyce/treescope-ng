import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    panelLabel?: string;
}

export default function AppLogo({ panelLabel }: AppLogoProps = {}) {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">TreeScope</span>
                {panelLabel && (
                    <span className="text-xs text-muted-foreground truncate">{panelLabel}</span>
                )}
            </div>
        </>
    );
}

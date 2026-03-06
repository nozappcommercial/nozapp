export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Minimal layout — no header/footer for immersive onboarding experience
    return <>{children}</>;
}

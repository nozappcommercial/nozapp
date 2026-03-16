import os

# Files to include in the bundle
KEY_FILES = [
    "src/app/actions/graph.ts",
    "src/components/SemanticSphere.tsx",
    "src/components/sphere/ShellNavigator.tsx",
    "src/components/onboarding/OnboardingFlow.tsx",
    "src/lib/graph/traversal.ts",
    "src/components/sphere.css",
    "src/app/sphere/page.tsx",
    "docs/approccio.md",
]

OUTPUT_FILE = "nozapp_project_bundle.md"

def bundle_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f_out:
        f_out.write("# Nozapp Project Bundle for AI Analysis\n\n")
        f_out.write("This document contains the core files of the Nozapp project for context and analysis.\n\n")
        
        # Add a file tree for context (simplified)
        f_out.write("## Project Structure (Core)\n")
        f_out.write("```text\n")
        for root, dirs, files in os.walk("."):
            if "node_modules" in dirs:
                dirs.remove("node_modules")
            if ".git" in dirs:
                dirs.remove(".git")
            if ".next" in dirs:
                dirs.remove(".next")
            
            level = root.replace(".", "").count(os.sep)
            indent = " " * 4 * level
            f_out.write(f"{indent}{os.path.basename(root)}/\n")
            sub_indent = " " * 4 * (level + 1)
            for f in files:
                if f.endswith((".ts", ".tsx", ".css", ".md")):
                    f_out.write(f"{sub_indent}{f}\n")
        f_out.write("```\n\n")

        for rel_path in KEY_FILES:
            abs_path = os.path.join(os.getcwd(), rel_path)
            if os.path.exists(abs_path):
                f_out.write(f"## File: {rel_path}\n")
                f_out.write(f"```{os.path.splitext(rel_path)[1][1:]}\n")
                with open(abs_path, "r", encoding="utf-8") as f_in:
                    f_out.write(f_in.read())
                f_out.write("\n```\n\n")
            else:
                print(f"Warning: {rel_path} not found.")

    print(f"Bundle created: {OUTPUT_FILE}")

if __name__ == "__main__":
    bundle_files()

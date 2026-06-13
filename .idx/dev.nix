{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_22
  ];
  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "vscodevim.vim"
      "google.gemini-cli-vscode-ide-companion"
    ];
    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
          cwd = "mini-link-memo";
        };
      };
    };
    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Create a new Vite project
        create-vite-project = "npm create vite@latest mini-link-memo -- --template react";
        # Install dependencies
        npm-install = "cd mini-link-memo && npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Start the dev server
        dev-server = "cd mini-link-memo && npm run dev";
      };
    };
  };
}

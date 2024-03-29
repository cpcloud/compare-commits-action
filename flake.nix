{
  description = "Compare a range of commits in GitHub Actions";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";

    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable-small";

    pre-commit-hooks = {
      url = "github:cachix/pre-commit-hooks.nix";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        flake-utils.follows = "flake-utils";
      };
    };
  };

  outputs = { self, nixpkgs, flake-utils, pre-commit-hooks }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        inherit (pkgs.lib) mkForce;
      in
      {
        checks = {
          pre-commit-check = pre-commit-hooks.lib.${system}.run {
            src = ./.;
            hooks = {
              nixpkgs-fmt.enable = true;
              shellcheck.enable = true;
              statix.enable = true;
              taplo.enable = true;

              prettier = {
                enable = true;
                entry = mkForce "${pkgs.nodejs_20}/bin/npm run format";
                types_or = [ "json" "yaml" "ts" ];
                excludes = [ "package-lock\\.json" ];
              };

              eslint = {
                enable = true;
                entry = mkForce "${pkgs.nodejs_20}/bin/npm run lint";
                types = [ "ts" ];
              };

              shfmt = {
                enable = true;
                entry = mkForce "${pkgs.shfmt}/bin/shfmt -i 2 -sr -d -s -l";
                files = "\\.sh$";
              };
            };

          };
        };

        devShell = pkgs.mkShell {
          name = "compare-commits-action";
          buildInputs = with pkgs; [
            fd
            git
            nixpkgs-fmt
            nodejs_20
            shellcheck
            shfmt
            statix
            taplo
          ];

          # npm forces output that can't possibly be useful to stdout so redirect
          # stdout to stderr
          shellHook = ''
            ${self.checks.${system}.pre-commit-check.shellHook}
            npm install --no-fund 1>&2
          '';
        };
      });
}

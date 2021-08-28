let
  sources = import ./nix/sources.nix;
  inherit (import sources.nixpkgs { }) lib;
  pre-commit-hooks = import sources.pre-commit-hooks;
in
{
  pre-commit-check = pre-commit-hooks.run {
    src = ./.;
    hooks = {
      nix-linter = {
        enable = true;
        entry = lib.mkForce "nix-linter";
        excludes = [ "nix/sources.nix" ];
      };

      nixpkgs-fmt = {
        enable = true;
        entry = lib.mkForce "nixpkgs-fmt --check";
      };

      prettier = {
        enable = true;
        entry = lib.mkForce "npm run format-check";
        types_or = [ "json" "toml" "yaml" "ts" ];
        excludes = [
          "package-lock.json"
        ];
      };

      eslint = {
        enable = true;
        entry = lib.mkForce "npm run lint";
        files = "\\.ts$";
      };

      shellcheck = {
        enable = true;
        entry = lib.mkForce "shellcheck";
        files = "\\.sh$";
        types_or = lib.mkForce [ ];
      };

      shfmt = {
        enable = true;
        entry = lib.mkForce "shfmt -i 2 -sr -d -s -l";
        files = "\\.sh$";
      };
    };
  };
}

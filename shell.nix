let
  sources = import ./nix/sources.nix;
  pkgs = import sources.nixpkgs { };
in
pkgs.mkShell {
  name = "compare-commits-action";
  buildInputs = with pkgs; [
    git
    niv
    nix-linter
    nixpkgs-fmt
    nodejs_latest
    shellcheck
    shfmt
  ];

  # npm forces output that can't possibly be useful to stdout so redirect
  # stdout to stderr
  shellHook = ''
    ${(import ./pre-commit.nix).pre-commit-check.shellHook}
    npm install --no-fund 1>&2
  '';
}

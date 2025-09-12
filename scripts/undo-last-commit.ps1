<# 
Purpose: Quickly undo the last commit in a Git repo on Windows PowerShell 5.1.

Usage examples:
  # Not pushed; keep your file changes in working dir (default safe local undo)
  powershell -ExecutionPolicy Bypass -File scripts/undo-last-commit.ps1 -Mode mixed -Commits 1

  # Not pushed; keep changes staged
  powershell -ExecutionPolicy Bypass -File scripts/undo-last-commit.ps1 -Mode soft

  # Not pushed; discard changes entirely
  powershell -ExecutionPolicy Bypass -File scripts/undo-last-commit.ps1 -Mode hard

  # Pushed; create a reversing commit (safe, no history rewrite)
  powershell -ExecutionPolicy Bypass -File scripts/undo-last-commit.ps1 -Mode revert

  # Pushed; rewrite remote history (use only if you know all collaborators agree)
  powershell -ExecutionPolicy Bypass -File scripts/undo-last-commit.ps1 -Mode force

#>

param(
  [ValidateSet('mixed','soft','hard','revert','force')]
  [string]$Mode = 'mixed',
  [int]$Commits = 1
)

function Invoke-OrDie([string]$cmd) {
  Write-Host "→ $cmd"
  $LASTEXITCODE = 0
  cmd.exe /c $cmd
  if ($LASTEXITCODE -ne 0) { throw "Command failed: $cmd" }
}

# Basic sanity checks
Invoke-OrDie "git rev-parse --is-inside-work-tree"

# Show current branch and top commits for context
Invoke-OrDie "git rev-parse --abbrev-ref HEAD"
Invoke-OrDie "git log --oneline -n 5"

switch ($Mode) {
  'mixed'  { Invoke-OrDie "git reset --mixed HEAD~$Commits" }
  'soft'   { Invoke-OrDie "git reset --soft HEAD~$Commits" }
  'hard'   { Invoke-OrDie "git reset --hard HEAD~$Commits" }
  'revert' {
    # Safest when the unwanted commit is already pushed
    # Revert HEAD, or multiple commits with -Commits N (reverts range one by one)
    for ($i = 0; $i -lt $Commits; $i++) {
      Invoke-OrDie "git revert --no-edit HEAD~$i"
    }
    Write-Host "Now push the revert commit(s) with: git push"
  }
  'force'  {
    # WARNING: rewrites remote history. Prefer 'revert' for shared branches.
    Invoke-OrDie "git reset --hard HEAD~$Commits"
    Write-Host "To update remote (DANGEROUS), run: git push --force-with-lease"
  }
}

Write-Host "`nStatus after operation:"
Invoke-OrDie "git status"
Write-Host "`nRecent commits:"
Invoke-OrDie "git log --oneline -n 5"



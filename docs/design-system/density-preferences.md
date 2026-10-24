# Density preferences

The `DensityProvider` sets one of `density-compact`, `density-default`, or `density-comfortable` on the root element. Shared `TableHead` and `TableCell` consume `--density-padding-cell`. Order-book depth rows use the same root preference through CSS selectors, without requiring standalone consumers to mount the context.

The preference persists in `interface-density` local storage. Recheck both light and dark surfaces for table height, keyboard focus and legibility before release.

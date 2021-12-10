# mpopal
CLI tool for managing MPO 3D image files with batch capability

## Usage

```
node mpocli.js -i /input/file/or/directory -o /output/directory -t transformation
```

## Arguments

`-i` A file or directory. If a directory, it is scanned for `.mpo` files

`-o` An output directory for processed files. Uses the working directory if omitted.

`-t` The transformation to perform. Can be specified multiple times.

## Transformations

The following transformations are supported:

`split`
Split the MPO file into left and right JPEGs, appending `_l` and `_r` to the output filenames. Default
behaviour is not transformation is specified.

`parallel`
Create a single image for parallel viewing. Appends `_parallel` to the output filename.

`cross`
Create a single image for cross viewing. Appends `_cross` to the output filename.

`triplet`
Create a single image for cross and parallel viewing. Appends `_triplet` to the output filename.

## Examples

Split a single file into the currect directory

```
node mpocli.js -i /my/images/image.mpo
```

Scan a folder and create parallel images

```
node mpocli.js -i /my/images -t parallel
```

Select an output directory

```
node mpocli.js -i /my/images -o /my/processed/images -t parallel
```

Perform multiple transforrmations

```
node mpocli.js -i /my/images -o /my/processed/images -t parallel -t cross -t triplet
```

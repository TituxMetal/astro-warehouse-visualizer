# Warehouse Location Visualizer

A modern web application built with Astro, React, TypeScript, and Tailwind CSS that provides a
visual representation of warehouse locations. This tool helps warehouse operators and managers to
easily visualize and navigate through warehouse locations using a standardized addressing system.

## Purpose

In logistics warehouses, locations are identified using a structured addressing system. Each address
consists of four components:

- **Cell**: A major section of the warehouse
- **Aisle**: A numbered corridor within a cell
- **Position**: A specific location along the aisle
- **Level**: The vertical position (height) in multiples of 10

For example, the address `4-016-0026-30` represents:

- Cell: 4
- Aisle: 016
- Position: 0026
- Level: 30 (third level)

This visualization tool helps warehouse staff to:

- Quickly understand the structure of warehouse addresses
- Visualize the relative position of locations
- Validate warehouse addresses
- Navigate through different warehouse locations

## Features

- **Interactive Visualization**: Shows a graphical representation of warehouse locations
- **Address Validation**: Ensures addresses follow the correct format and constraints
- **Real-time Updates**: Updates visualization as new addresses are entered
- **URL-based Navigation**: Enables sharing specific locations via URLs
- **Responsive Design**: Works on both desktop and mobile devices
- **Level Validation**: Ensures levels are valid multiples of 10 (10, 20, 30, 40)

## Technical Stack

- **[Astro](https://astro.build/)**: Core framework for static site generation and routing
- **[React](https://reactjs.org/)**: Interactive UI components
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first styling

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/TituxMetal/astro-warehouse-visualizer
cd warehouse-visualizer
```

2. Install dependencies:

```bash
yarn install
```

3. Run the development server:

```bash
yarn dev
```

4. Open http://localhost:4321 in your browser

## Usage

1. Enter a warehouse address in the format: `cell-aisle-position-level` Example: `4-016-0026-30`
2. The visualization will update to show: The selected cell The correct aisle Nearby positions
   Available levels
3. Invalid addresses or levels will show error messages
4. Share locations by copying the URL

## Warehouse Configuration

The default warehouse configuration can be modified in `src/types/warehouse.ts`:

```typescript
export const DEFAULT_CONFIG: WarehouseConfig = {
  cell: 4,
  aislesCount: 19,
  locationsPerAisle: 100,
  levelsPerLocation: 4
}
```

## Address Format

Warehouse addresses must follow this format: `cell`: 1-2 digits `aisle`: 3 digits (padded with
zeros) `position`: 4 digits (padded with zeros) `level`: 2 digits (must be a multiple of 10)
Example: `4-016-0026-30`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

    [ ] Add zoom controls for better visualization
    [ ] Implement color coding for different types of locations
    [ ] Add search/filter functionality
    [ ] Include export/import capabilities
    [ ] Add location history tracking

## Support

For support, please open an issue in the GitHub repository.

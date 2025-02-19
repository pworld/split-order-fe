# split-order-fe


## Getting Started
This application need: https://github.com/pworld/split-order-be As a Backend.


### 1.Clone the Repository

```bash
    git clone https://github.com/pworld/split-order-fe.git
    cd split-order-fe
```

### 2. Install Dependencies

```bash
    npm install
```

### 3. Running the development server.

```bash
    npm run dev
```


### 4. Building for production.

```bash
    npm run build
```

### 5. Running the production server.

```bash
    npm run start
```

## Project Structure

```bash
├── src
│   ├── components      # Reusable UI components
│   ├── contexts        # contexts to used in application
│   ├── models          # entity or type to be used as reference
│   ├── pages           # Application pages for view for separation concerns
│   ├── services        # Application pages Logic and API for separation concerns like for unit testing
│       ├── api         # API service calls
│       ├── store       # State Management
│   ├── App.tsx         # Main application component
│   └── index.tsx        # Entry point
├── public              # Static assets
├── package.json        # Project dependencies & scripts
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation
```

## Environment Variables

Create a .env file in the root directory and configure necessary variables:

```bash
VITE_API_BASE_URL=http://localhost:3001/api
```
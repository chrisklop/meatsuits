import { NextRequest, NextResponse } from 'next/server';
import {
  bounties,
  getBountyById,
  getBountiesByStatus,
  getWorkersByStatus,
  type Bounty,
} from '@/lib/mock-data';
import type { BountyStatus } from '@/lib/types';

// JSON-RPC 2.0 Error Codes
const JSONRPC_ERRORS = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, unknown>;
  id?: string | number | null;
}

interface JsonRpcSuccessResponse {
  jsonrpc: '2.0';
  result: unknown;
  id: string | number | null;
}

interface JsonRpcErrorResponse {
  jsonrpc: '2.0';
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: string | number | null;
}

type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

function createSuccessResponse(result: unknown, id: string | number | null): JsonRpcSuccessResponse {
  return {
    jsonrpc: '2.0',
    result,
    id,
  };
}

function createErrorResponse(
  code: number,
  message: string,
  id: string | number | null = null,
  data?: unknown
): JsonRpcErrorResponse {
  return {
    jsonrpc: '2.0',
    error: {
      code,
      message,
      ...(data !== undefined && { data }),
    },
    id,
  };
}

// GET handler - returns API info
export async function GET() {
  return NextResponse.json({
    name: 'meatsuits-mcp',
    version: '1.0.0',
    description: 'Meatsuits.ai MCP endpoint for AI agent interaction',
    methods: ['bounties.list', 'bounties.get', 'bounties.create', 'workers.available'],
    jsonrpc: '2.0',
    documentation: {
      'bounties.list': {
        description: 'List bounties with optional filters',
        params: {
          status: 'optional BountyStatus filter',
          limit: 'optional number of results (default: all)',
          offset: 'optional offset for pagination (default: 0)',
        },
      },
      'bounties.get': {
        description: 'Get a single bounty by ID',
        params: {
          id: 'required bounty ID string',
        },
      },
      'bounties.create': {
        description: 'Create a new bounty (requires Supabase connection)',
        params: {
          title: 'required string',
          description: 'required string',
          sector: 'required BountySector',
          reward_amount: 'required number',
          difficulty: 'required BountyDifficulty',
          agent_id: 'required string',
        },
      },
      'workers.available': {
        description: 'List available workers with optional sector filter',
        params: {
          sector: 'optional BountySector filter',
        },
      },
    },
  });
}

// POST handler - processes JSON-RPC requests
export async function POST(request: NextRequest) {
  let rpcRequest: JsonRpcRequest;

  // Parse request body
  try {
    const body = await request.json();
    rpcRequest = body;
  } catch {
    return NextResponse.json(
      createErrorResponse(JSONRPC_ERRORS.PARSE_ERROR, 'Parse error: Invalid JSON'),
      { status: 400 }
    );
  }

  // Validate JSON-RPC 2.0 format
  if (rpcRequest.jsonrpc !== '2.0') {
    return NextResponse.json(
      createErrorResponse(
        JSONRPC_ERRORS.INVALID_REQUEST,
        'Invalid Request: jsonrpc must be "2.0"',
        rpcRequest.id
      ),
      { status: 400 }
    );
  }

  if (typeof rpcRequest.method !== 'string') {
    return NextResponse.json(
      createErrorResponse(
        JSONRPC_ERRORS.INVALID_REQUEST,
        'Invalid Request: method must be a string',
        rpcRequest.id
      ),
      { status: 400 }
    );
  }

  const { method, params = {}, id = null } = rpcRequest;

  try {
    // Route to appropriate method handler
    switch (method) {
      case 'bounties.list':
        return handleBountiesList(params, id);

      case 'bounties.get':
        return handleBountiesGet(params, id);

      case 'bounties.create':
        return handleBountiesCreate(params, id);

      case 'workers.available':
        return handleWorkersAvailable(params, id);

      default:
        return NextResponse.json(
          createErrorResponse(JSONRPC_ERRORS.METHOD_NOT_FOUND, `Method not found: ${method}`, id),
          { status: 404 }
        );
    }
  } catch (error) {
    console.error('MCP API error:', error);
    return NextResponse.json(
      createErrorResponse(
        JSONRPC_ERRORS.INTERNAL_ERROR,
        'Internal error',
        id,
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}

// bounties.list handler
function handleBountiesList(
  params: Record<string, unknown>,
  id: string | number | null
): NextResponse<JsonRpcResponse> {
  const { status, limit, offset = 0 } = params;

  // Validate parameters
  if (status !== undefined && typeof status !== 'string') {
    return NextResponse.json(
      createErrorResponse(JSONRPC_ERRORS.INVALID_PARAMS, 'Invalid params: status must be a string', id)
    );
  }

  if (limit !== undefined && (typeof limit !== 'number' || limit < 0)) {
    return NextResponse.json(
      createErrorResponse(JSONRPC_ERRORS.INVALID_PARAMS, 'Invalid params: limit must be a positive number', id)
    );
  }

  if (typeof offset !== 'number' || offset < 0) {
    return NextResponse.json(
      createErrorResponse(JSONRPC_ERRORS.INVALID_PARAMS, 'Invalid params: offset must be a positive number', id)
    );
  }

  // Filter bounties
  let filteredBounties: Bounty[] = bounties;

  if (status) {
    filteredBounties = getBountiesByStatus(status as BountyStatus);
  }

  const total = filteredBounties.length;

  // Apply pagination
  let paginatedBounties = filteredBounties.slice(offset);
  if (limit) {
    paginatedBounties = paginatedBounties.slice(0, limit);
  }

  return NextResponse.json(
    createSuccessResponse(
      {
        bounties: paginatedBounties,
        total,
      },
      id
    )
  );
}

// bounties.get handler
function handleBountiesGet(
  params: Record<string, unknown>,
  id: string | number | null
): NextResponse<JsonRpcResponse> {
  const { id: bountyId } = params;

  // Validate parameters
  if (!bountyId || typeof bountyId !== 'string') {
    return NextResponse.json(
      createErrorResponse(JSONRPC_ERRORS.INVALID_PARAMS, 'Invalid params: id is required and must be a string', id)
    );
  }

  // Get bounty
  const bounty = getBountyById(bountyId);

  if (!bounty) {
    return NextResponse.json(
      createErrorResponse(JSONRPC_ERRORS.INTERNAL_ERROR, `Bounty not found: ${bountyId}`, id),
      { status: 404 }
    );
  }

  return NextResponse.json(createSuccessResponse(bounty, id));
}

// bounties.create handler
function handleBountiesCreate(
  _params: Record<string, unknown>,
  id: string | number | null
): NextResponse<JsonRpcResponse> {
  // Mock mode - reject create operations
  return NextResponse.json(
    createErrorResponse(
      JSONRPC_ERRORS.INTERNAL_ERROR,
      'Supabase not connected - create operations disabled in mock mode',
      id,
      {
        hint: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable create operations',
      }
    ),
    { status: 503 }
  );
}

// workers.available handler
function handleWorkersAvailable(
  params: Record<string, unknown>,
  id: string | number | null
): NextResponse<JsonRpcResponse> {
  const { sector } = params;

  // Validate parameters
  if (sector !== undefined && typeof sector !== 'string') {
    return NextResponse.json(
      createErrorResponse(JSONRPC_ERRORS.INVALID_PARAMS, 'Invalid params: sector must be a string', id)
    );
  }

  // Filter workers
  let availableWorkers = getWorkersByStatus('available');

  if (sector) {
    availableWorkers = availableWorkers.filter((w) => w.sector === sector);
  }

  return NextResponse.json(
    createSuccessResponse(
      {
        workers: availableWorkers,
        total: availableWorkers.length,
      },
      id
    )
  );
}

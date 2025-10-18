import { NextResponse } from 'next/server';
import { getMockOrders } from '@/lib/mock-data';
import type { Order, OrderType, OrderSide } from '@/lib/types';

export const dynamic = 'force-dynamic';

// In-memory storage for demo purposes
let orders: Order[] = getMockOrders();

export async function GET() {
  try {
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, type, side, amount, price, stopPrice } = body;

    // Validate required fields
    if (!symbol || !type || !side || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new order
    const newOrder: Order = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      type: type as OrderType,
      side: side as OrderSide,
      amount: parseFloat(amount),
      price: price ? parseFloat(price) : undefined,
      stopPrice: stopPrice ? parseFloat(stopPrice) : undefined,
      status: type === 'market' ? 'filled' : 'pending',
      filledAmount: type === 'market' ? parseFloat(amount) : 0,
      filledPrice: type === 'market' ? price : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    orders.unshift(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orders[orderIndex];
    if (order.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending orders can be cancelled' },
        { status: 400 }
      );
    }

    order.status = 'cancelled';
    order.updatedAt = Date.now();

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}


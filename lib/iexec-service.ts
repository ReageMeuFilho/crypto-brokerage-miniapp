import { IExec } from 'iexec';

export interface DarkPoolOrder {
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  timestamp: number;
}

export interface IExecResult {
  raw_tx: {
    to: string;
    data: string;
    value: string;
    gasLimit: string;
  };
  result: {
    orderId: string;
    status: string;
    executedPrice?: number;
    executedAmount?: number;
  };
}

export class IExecService {
  private iexec: IExec;
  private appAddress: string;

  constructor(ethProvider: any) {
    this.iexec = new IExec({
      ethProvider: 'bellecour',
    });
    this.appAddress = process.env.NEXT_PUBLIC_IEXEC_APP_ADDRESS || '';
  }

  async submitOrder(order: DarkPoolOrder): Promise<string> {
    try {
      const orderData = JSON.stringify(order);
      
      const { dealid } = await this.iexec.order.matchOrders({
        apporder: await this.getAppOrder(),
        datasetorder: undefined,
        workerpoolorder: await this.getWorkerpoolOrder(),
        requestorder: await this.createRequestOrder(orderData),
      });

      console.log('Order submitted to iExec, dealid:', dealid);
      return dealid;
    } catch (error) {
      console.error('Error submitting order to iExec:', error);
      throw new Error('Failed to submit order to iExec');
    }
  }

  async waitForCompletion(dealid: string): Promise<void> {
    try {
      console.log('Waiting for iExec task completion...');
      
      let attempts = 0;
      const maxAttempts = 60;
      
      while (attempts < maxAttempts) {
        const taskStatus = await this.iexec.task.show(dealid);
        
        if (taskStatus.status === 3) {
          console.log('iExec task completed');
          return;
        }
        
        if (taskStatus.status === 4) {
          throw new Error('Task failed');
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      }
      
      throw new Error('Task did not complete in time');
    } catch (error) {
      console.error('Error waiting for task completion:', error);
      throw new Error('Task did not complete in time');
    }
  }

  async fetchResults(dealid: string): Promise<IExecResult> {
    try {
      console.log('Fetching results from iExec...');
      
      const taskResult: any = await this.iexec.task.fetchResults(dealid);
      const resultsPath = taskResult.location || taskResult;
      
      let raw_tx, result;
      
      if (typeof resultsPath === 'string') {
        const rawTxResponse = await fetch(`${resultsPath}/raw_tx.json`);
        const resultResponse = await fetch(`${resultsPath}/result.json`);
        
        if (!rawTxResponse.ok || !resultResponse.ok) {
          throw new Error('Failed to fetch result files');
        }
        
        raw_tx = await rawTxResponse.json();
        result = await resultResponse.json();
      } else {
        raw_tx = resultsPath.raw_tx || resultsPath;
        result = resultsPath.result || {};
      }
      
      return { raw_tx, result };
    } catch (error) {
      console.error('Error fetching results:', error);
      throw new Error('Failed to fetch results from iExec');
    }
  }

  private async getAppOrder() {
    const appOrder = await this.iexec.order.createApporder({
      app: this.appAddress,
      appprice: 0,
      volume: 1,
    });
    
    return this.iexec.order.signApporder(appOrder);
  }

  private async getWorkerpoolOrder() {
    const workerpools = await this.iexec.orderbook.fetchWorkerpoolOrderbook();
    if (!workerpools.orders || workerpools.orders.length === 0) {
      throw new Error('No workerpool available');
    }
    
    return workerpools.orders[0].order;
  }

  private async createRequestOrder(inputData: string) {
    const requestOrder = await this.iexec.order.createRequestorder({
      app: this.appAddress,
      category: 0,
      appmaxprice: 0,
      workerpoolmaxprice: 0,
      requester: await this.iexec.wallet.getAddress(),
      volume: 1,
      params: {
        iexec_args: inputData,
      },
    });
    
    return this.iexec.order.signRequestorder(requestOrder);
  }
}

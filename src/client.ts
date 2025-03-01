import { Customer } from './customer'
import { CustomerOptions } from './types'
import { Hooks } from './hooks'
import { services } from './protos'
import { Service } from './service'

export interface ClientOptions {
  client_id: string
  client_secret: string
  developer_token: string
  disable_parsing?: boolean
}

export class Client {
  private readonly options: ClientOptions

  constructor(options: ClientOptions) {
    this.options = options
  }

  public Customer(customerOptions: CustomerOptions, hooks?: Hooks): Customer {
    const cus = new Customer(this.options, customerOptions, hooks)
    return cus
  }

  public async listAccessibleCustomers(
    refreshToken: string,
    loginCustomerId?: string,
    linkedCustomerId?: string
  ): Promise<services.ListAccessibleCustomersResponse> {
    const customerOptions: CustomerOptions = {
      customer_id: '',
      refresh_token: refreshToken,
    }
    if (loginCustomerId) {
      customerOptions.login_customer_id = loginCustomerId
    }
    if (linkedCustomerId) {
      customerOptions.linked_customer_id = linkedCustomerId
    }

    const service = new Service(this.options, customerOptions)

    // prettier-ignore
    // @ts-expect-error Protected usage is fine here
    const customerService = await service.loadService<services.CustomerService>("CustomerServiceClient");
    try {
      // @ts-expect-error Type definition is incorrect, response is an array
      const [response] = await customerService.listAccessibleCustomers(
        {},
        {
          // @ts-expect-error Field not included in type definitions
          otherArgs: {
            // @ts-expect-error Protected usage is fine here
            headers: service.callHeaders,
          },
        }
      )
      return response
    } catch (err) {
      console.log(err)
      // @ts-expect-error Protected usage is fine here
      throw service.getGoogleAdsError(err)
    }
  }
}

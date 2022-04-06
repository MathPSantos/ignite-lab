import { CustomersService } from './../../../services/customers.service';
import { CreatePurchaseInput } from './../inputs/create-purchase.input';
import { ProductsService } from 'src/services/products.service';
import { Product } from './../models/product';
import { AuthorizationGuard } from './../../auth/authorization.guard';
import { Purchase } from './../models/purchase';
import { PurchasesService } from './../../../services/purchases.service';
import {
  Parent,
  ResolveField,
  Resolver,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private purchasesService: PurchasesService,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  purchases() {
    return this.purchasesService.listAllPurchases();
  }

  @ResolveField(() => Product)
  product(@Parent() purchase: Purchase) {
    return this.productsService.getProductById(purchase.productId);
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    let customer = await this.customersService.getCustomerByAuthUserId(
      user.sub,
    );

    if (!customer) {
      customer = await this.customersService.createCustomer({
        authUserId: user.sub,
      });
    }

    return this.purchasesService.createPurchase({
      customerId: customer.id,
      productId: data.productId,
    });
  }
}

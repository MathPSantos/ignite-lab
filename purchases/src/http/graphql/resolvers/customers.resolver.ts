import { PurchasesService } from './../../../services/purchases.service';
import { Purchase } from './../models/purchase';
import { AuthorizationGuard } from './../../auth/authorization.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from './../../auth/current-user';
import { Customer } from './../models/customer';
import { CustomersService } from './../../../services/customers.service';
import { ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/http/auth/current-user';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(
    private customersService: CustomersService,
    private purchasesService: PurchasesService,
  ) {}

  @Query(() => Customer)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.customersService.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField(() => [Purchase])
  purchases(@Parent() customer: Customer) {
    return this.purchasesService.listAllFromCustomer(customer.id);
  }
}

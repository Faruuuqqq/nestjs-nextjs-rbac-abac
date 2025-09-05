// src/common/guards/policies.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from 'src/core/ability/ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/policies.decorator';
import { AppAbility } from 'src/core/ability/ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Dapatkan handler kebijakan dari metadata
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    // 2. Dapatkan pengguna dari request (sudah divalidasi oleh JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 3. Buat objek 'ability' untuk pengguna ini
    const ability = this.abilityFactory.defineAbility(user);

    // 4. Jalankan setiap handler kebijakan dengan objek 'ability'
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
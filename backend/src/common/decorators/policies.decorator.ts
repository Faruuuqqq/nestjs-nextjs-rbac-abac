// src/common/decorators/policies.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AppAbility } from 'src/core/ability/ability.factory';

// Definisikan tipe untuk sebuah handler kebijakan.
// Ini bisa berupa class atau fungsi sederhana yang menerima 'ability' dan mengembalikan boolean.
interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CHECK_POLICIES_KEY = 'check_policy';

/**
 * Decorator untuk menetapkan kebijakan (aturan) yang harus dipenuhi.
 * Contoh penggunaan: @CheckPolicies((ability) => ability.can(Action.Create, Post))
 */
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
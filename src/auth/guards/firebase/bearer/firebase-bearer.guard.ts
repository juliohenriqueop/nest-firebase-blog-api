import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FirebaseBearerGuard extends AuthGuard('firebase-jwt') {}

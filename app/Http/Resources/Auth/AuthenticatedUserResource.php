<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthenticatedUserResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'username' => $this->username,
            'email' => $this->email,
            'avatar' => is_null($this->avatar) ? null : storage_asset($this->avatar),
            'role' => $this->getRoleNames()->first(),
            'permissions' => $this->getPermissionsViaRoles()->pluck('name'),
        ];
    }
}

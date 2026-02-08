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
            'avatar' => 'https://ui-avatars.com/api/?bold=true&color=eff6ff&background=1447e6&name=' . str()->of($this->username)->slug('+')->value,
            'role' => $this->getRoleNames()->first(),
            'permissions' => $this->getPermissionsViaRoles()->pluck('name'),
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class document extends Model
{
    use HasFactory;

    protected $primarykey = 'codeDocument';
    protected $fillable = ['NameDocument' , 'dateCreation' , 'UrlDocument'];
}

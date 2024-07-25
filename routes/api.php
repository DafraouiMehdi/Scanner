<?php

use Illuminate\Http\Request;
use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::resource('/ScannerPiece' , DocumentController::class);

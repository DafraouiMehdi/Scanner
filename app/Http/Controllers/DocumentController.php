<?php

namespace App\Http\Controllers;

use App\Models\document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('ModalComponents');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'NameDocument' => 'required|string|max:50',
                'UrlDocument' => 'required|url',
            ]);

            $urlDocument = $request->UrlDocument;
            $imageContent = file_get_contents($urlDocument);

            if ($imageContent === false) {
                return response()->json(['msg' => 'Error retrieving image content'], 400);
            }

            $imageName = Str::random(60) . ".png";
            $save = file_put_contents(storage_path("app/public/dwt/$imageName"), $imageContent);

            if (!$save) {
                return response()->json(['msg' => 'Error saving image content'], 500);
            }

            $imageUrl = asset("storage/dwt/$imageName");

            document::create([
                'NameDocument' => $request->NameDocument,
                'dateCreation' => now(),
                'UrlDocument' => $imageUrl,
            ]);

            // return redirect()->route('index');
            return response()->json(['msg' => 'document is inserted successefully']);

        } catch (ValidationException $e) {
            return response()->json($e->validator->errors(), 422);
        } catch (\Exception $error) {
            return response()->json(['msg' => 'Oops, document not inserted!', 'error' => $error->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(document $document)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, document $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(document $document)
    {
        //
    }
}

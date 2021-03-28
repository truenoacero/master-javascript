import { Component, OnInit } from '@angular/core';
import { Project } from "../../models/project";
import { ProjectService } from "../../services/project.service";
import { UploadService } from "../../services/upload.service";
import { Global } from "../../services/global";
import { Router, ActivatedRoute, Params} from "@angular/router";



@Component({
  selector: 'app-edit',
  templateUrl: '../create/create.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ProjectService, UploadService]

})
export class EditComponent implements OnInit {

  public title: string;
  public project: Project;
  public projectSaved: Project;
  public status: string;
  public filesToUpload : Array<File>;
  public url: string;

  constructor(
    private _projectService: ProjectService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title = 'Editar  Proyecto';
    this.url = Global.url;

  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      const id = params.id;
      this.getProject(id);
    });
  }
  getProject(id){
    this._projectService.findById(id).subscribe(
      response => {
        this.project = response.project;
      },
      error => {
        console.log(error);
      }
    )

  }
  onSubmit(){
    this._projectService.update(this.project).subscribe(
      response =>{
        if(response.project){
          this.status = 'Success';
          if(this.filesToUpload){
            this._uploadService.makeFileRequest(Global.url+'/upload-image/'+response.project._id,[], this.filesToUpload, 'image')
              .then((result: any) => {
                this.projectSaved = result.project;
                console.log(result);
              });
          }

        }
        else{
          this.status = 'Failed';
        }
        console.log(response);
      },
      error =>{
        console.log(error);
      }
    )
  }


}

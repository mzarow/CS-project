import { Service } from 'typedi';
import { DeleteResult, UpdateResult } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { filterXSS } from 'xss';

import CommentDto from '../dto/CommentDto';
import Comment from '../entity/Comment';
import Project from '../entity/Project';
import User from '../entity/User';
import CommentRepository from '../repository/CommentRepository';
import ProjectRepository from '../repository/ProjectRepository';
import SecurityService from './SecurityService';

@Service()
export default class CommentService {
    constructor(
        @InjectRepository() private commentRepository: CommentRepository,
        @InjectRepository() private projectRepository: ProjectRepository,
        private securityService: SecurityService,
    ) {}

    public async create(id: number, data: CommentDto, user: User): Promise<Comment> {
        const project: Project = await this.projectRepository.findOneOrFail(id);
        const comment: Comment = await this.commentRepository.save({
            content: filterXSS(data.text),
            project,
            user,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return comment;
    }

    public read(): Promise<[]> {
        return this.commentRepository.getAllWithAuthors();
    }

    public async update(id: number, data: CommentDto, user: User): Promise<UpdateResult> {
        const comment: Comment = await this.getById(id, user);

        return await this.commentRepository.update(comment, {
            content: filterXSS(data.text),
            updatedAt: new Date(),
        });
    }

    public async delete(id: number, user: User): Promise<DeleteResult> {
        const comment: Comment = await this.getById(id, user);

        return await this.commentRepository.delete(comment);
    }

    private async getById(id: number, user: User): Promise<Comment> {
        const comment: Comment = await this.commentRepository.findOneOrFail(id, { relations: ['user'] });

        this.securityService.denyUnlessGranted(comment, user);

        return comment;
    }
}

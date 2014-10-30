namespace QCircuit.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SavedCircuits",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        UserId = c.String(maxLength: 128),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        UserName = c.String(),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                        User_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.LoginProvider, t.ProviderKey })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.SavedGates",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        UserId = c.String(maxLength: 128),
                        Name = c.String(),
                        Display = c.String(),
                        SerializedMatrix = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.SavedCircuitSlots",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        CircuitId = c.Guid(nullable: false),
                        SlotNumber = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SavedCircuits", t => t.CircuitId, cascadeDelete: true)
                .Index(t => t.CircuitId);
            
            CreateTable(
                "dbo.SavedGateInstances",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        GateId = c.Guid(nullable: false),
                        Position = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SavedGateInstances", t => t.GateId)
                .Index(t => t.GateId);
            
            CreateTable(
                "dbo.SlotGates",
                c => new
                    {
                        SlotId = c.Guid(nullable: false),
                        GateId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.SlotId, t.GateId })
                .ForeignKey("dbo.SavedCircuitSlots", t => t.SlotId, cascadeDelete: true)
                .ForeignKey("dbo.SavedGateInstances", t => t.GateId, cascadeDelete: true)
                .Index(t => t.SlotId)
                .Index(t => t.GateId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SlotGates", "GateId", "dbo.SavedGateInstances");
            DropForeignKey("dbo.SlotGates", "SlotId", "dbo.SavedCircuitSlots");
            DropForeignKey("dbo.SavedGateInstances", "GateId", "dbo.SavedGateInstances");
            DropForeignKey("dbo.SavedCircuitSlots", "CircuitId", "dbo.SavedCircuits");
            DropForeignKey("dbo.SavedGates", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.SavedCircuits", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.SlotGates", new[] { "GateId" });
            DropIndex("dbo.SlotGates", new[] { "SlotId" });
            DropIndex("dbo.SavedGateInstances", new[] { "GateId" });
            DropIndex("dbo.SavedCircuitSlots", new[] { "CircuitId" });
            DropIndex("dbo.SavedGates", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "User_Id" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.SavedCircuits", new[] { "UserId" });
            DropTable("dbo.SlotGates");
            DropTable("dbo.SavedGateInstances");
            DropTable("dbo.SavedCircuitSlots");
            DropTable("dbo.SavedGates");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.SavedCircuits");
        }
    }
}

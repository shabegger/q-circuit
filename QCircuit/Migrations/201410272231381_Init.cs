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
                        Id = c.Guid(nullable: false, identity: true),
                        UserId = c.String(maxLength: 128),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.SavedCircuitSlots",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
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
                        Id = c.Guid(nullable: false, identity: true),
                        GateId = c.Guid(nullable: false),
                        Position = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SavedGates", t => t.GateId, cascadeDelete: true)
                .Index(t => t.GateId);
            
            CreateTable(
                "dbo.SavedGates",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        UserId = c.String(maxLength: 128),
                        Name = c.String(),
                        Display = c.String(),
                        SerializedMatrix = c.String(),
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
                "dbo.SavedGateInstanceSavedCircuitSlots",
                c => new
                    {
                        SavedGateInstance_Id = c.Guid(nullable: false),
                        SavedCircuitSlot_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.SavedGateInstance_Id, t.SavedCircuitSlot_Id })
                .ForeignKey("dbo.SavedGateInstances", t => t.SavedGateInstance_Id, cascadeDelete: true)
                .ForeignKey("dbo.SavedCircuitSlots", t => t.SavedCircuitSlot_Id, cascadeDelete: true)
                .Index(t => t.SavedGateInstance_Id)
                .Index(t => t.SavedCircuitSlot_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SavedGateInstanceSavedCircuitSlots", "SavedCircuitSlot_Id", "dbo.SavedCircuitSlots");
            DropForeignKey("dbo.SavedGateInstanceSavedCircuitSlots", "SavedGateInstance_Id", "dbo.SavedGateInstances");
            DropForeignKey("dbo.SavedGateInstances", "GateId", "dbo.SavedGates");
            DropForeignKey("dbo.SavedGates", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "User_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.SavedCircuits", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.SavedCircuitSlots", "CircuitId", "dbo.SavedCircuits");
            DropIndex("dbo.SavedGateInstanceSavedCircuitSlots", new[] { "SavedCircuitSlot_Id" });
            DropIndex("dbo.SavedGateInstanceSavedCircuitSlots", new[] { "SavedGateInstance_Id" });
            DropIndex("dbo.SavedGateInstances", new[] { "GateId" });
            DropIndex("dbo.SavedGates", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "User_Id" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.SavedCircuits", new[] { "UserId" });
            DropIndex("dbo.SavedCircuitSlots", new[] { "CircuitId" });
            DropTable("dbo.SavedGateInstanceSavedCircuitSlots");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.SavedGates");
            DropTable("dbo.SavedGateInstances");
            DropTable("dbo.SavedCircuitSlots");
            DropTable("dbo.SavedCircuits");
        }
    }
}

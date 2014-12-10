using QCircuit.Models;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;

namespace QCircuit.Controllers.Api
{
    [Authorize]
    public class GatesController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Gates
        [AllowAnonymous]
        public IQueryable<SavedGate> GetGates()
        {
            if (db.User != null)
            {
                return db.Gates.Where(g => string.IsNullOrEmpty(g.UserId) || g.UserId == db.User.Id);
            }
            else
            {
                return db.Gates.Where(g => string.IsNullOrEmpty(g.UserId));
            }
        }

        // GET: api/Gates/5
        [ResponseType(typeof(SavedGate))]
        public IHttpActionResult GetSavedGate(Guid id)
        {
            SavedGate savedGate = db.Gates.Find(id);
            if (savedGate == null || savedGate.UserId != User.Identity.Name)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(savedGate.UserId) || savedGate.UserId != db.User.Id)
            {
                return Unauthorized();
            }

            return Ok(savedGate);
        }

        // PUT: api/Gates/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSavedGate(Guid id, SavedGate savedGate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != savedGate.Id)
            {
                return BadRequest();
            }

            SavedGate existingGate = db.Gates.Find(id);
            if (string.IsNullOrEmpty(existingGate.UserId) || existingGate.UserId != db.User.Id)
            {
                return Unauthorized();
            }

            db.Entry(savedGate).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SavedGateExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Gates
        [ResponseType(typeof(SavedGate))]
        public IHttpActionResult PostSavedGate(SavedGate savedGate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            savedGate.User = db.User;
            db.Gates.Add(savedGate);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (SavedGateExists(savedGate.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = savedGate.Id }, savedGate);
        }

        // DELETE: api/Gates/5
        [ResponseType(typeof(SavedGate))]
        public IHttpActionResult DeleteSavedGate(Guid id)
        {
            SavedGate savedGate = db.Gates.Find(id);
            if (savedGate == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(savedGate.UserId) || savedGate.UserId != db.User.Id)
            {
                return Unauthorized();
            }

            db.Gates.Remove(savedGate);
            db.SaveChanges();

            return Ok(savedGate);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SavedGateExists(Guid id)
        {
            return db.Gates.Any(g => g.Id == id);
        }
    }
}
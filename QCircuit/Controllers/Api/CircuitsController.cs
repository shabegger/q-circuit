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
    public class CircuitsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Circuits
        public IQueryable<SavedCircuit> GetCircuits()
        {
            return db.Circuits.Where(c => c.UserId == db.User.Id);
        }

        // GET: api/Circuits/5
        [ResponseType(typeof(SavedCircuit))]
        public IHttpActionResult GetSavedCircuit(Guid id)
        {
            SavedCircuit savedCircuit = db.Circuits.Find(id);
            if (savedCircuit == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(savedCircuit.UserId) || savedCircuit.UserId != db.User.Id)
            {
                return Unauthorized();
            }

            return Ok(savedCircuit);
        }

        // PUT: api/Circuits/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutSavedCircuit(Guid id, SavedCircuit savedCircuit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != savedCircuit.Id)
            {
                return BadRequest();
            }

            SavedCircuit existingCircuit = db.Circuits.Find(id);
            if (string.IsNullOrEmpty(existingCircuit.UserId) || existingCircuit.UserId != db.User.Id)
            {
                return Unauthorized();
            }

            db.Entry(savedCircuit).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SavedCircuitExists(id))
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

        // POST: api/Circuits
        [ResponseType(typeof(SavedCircuit))]
        public IHttpActionResult PostSavedCircuit([FromBody] SavedCircuit savedCircuit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            savedCircuit.UserId = db.User.Id;
            db.Circuits.Add(savedCircuit);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (SavedCircuitExists(savedCircuit.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = savedCircuit.Id }, savedCircuit);
        }

        // DELETE: api/Circuits/5
        [ResponseType(typeof(SavedCircuit))]
        public IHttpActionResult DeleteSavedCircuit(Guid id)
        {
            SavedCircuit savedCircuit = db.Circuits.Find(id);
            if (savedCircuit == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(savedCircuit.UserId) || savedCircuit.UserId != db.User.Id)
            {
                return Unauthorized();
            }

            db.Circuits.Remove(savedCircuit);
            db.SaveChanges();

            return Ok(savedCircuit);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SavedCircuitExists(Guid id)
        {
            return db.Circuits.Any(c => c.Id == id);
        }
    }
}
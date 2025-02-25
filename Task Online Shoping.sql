Create table Customer (CustomerID int identity(1,1) primary key, UserName varchar(30),Address varchar(250),Phone varchar(11))

insert into Customer (UserName,Address,Phone)values ('jagrut','Surat Gujarat','9558771257')
select*from Customer
create table Ajio_Products (ProductId int identity (1,1)primary key,productName varchar(250),Price decimal (18,2),Quantity Int ,ImageURl varchar(150))

insert into Ajio_Products(productName,Price,Quantity,ImageURl) values ('T-shirt',499,15,'assets\T-shirt.jpg'),('Jeans',599,20,'assets\Jeans.jpg'),('Shoes',1599,8,'assets\Shoes.jpg');
select *from Ajio_Products

exec sp_rename 'Ajio_Products.ImageURl','ImageUrl','column' ;

update Ajio_Products set price=1500 where ProductId=4;
UPDATE Ajio_Products
SET ImageURL = '\Jeans.jpg'
WHERE ProductId = 1;

create table cart (CartID int identity (1,1)primary key , CustomerID int foreign key(CustomerID) references Customer(CustomerID),ProductId int Foreign key (ProductId) references Ajio_Products(ProductId),Quantity int not null)
ALTER TABLE CART ADD TotalAmount int 

select*from cart
select*from Customer
select *from Ajio_Products
--Stored Procedure for Adding in cart 

	
create procedure GetCartItem
@CustomerID int 
as 
begin	
	SELECT 
	c.CartId,
	c.CustomerID,
	p.productId,
	p.productName,
	p.Price,
	p.Quantity as 'Available Stock',
	p.ImageUrl,
	c.Quantity,
	(p.Price*c.Quantity) as TotalAmount 
	from Cart c join Ajio_Products p on		 c.ProductId=p.ProductId where CustomerID = @CustomerID
	end ; 

--Sp to add Product in cart 


EXEC GetCartItem @CustomerID = 1;

create procedure AddToCart 
@CustomerID int,
@productId int ,
@Quantity int 
as 
begin 
	Declare @ProductPrice Decimal(18,2);
	Declare @Stock	int ;
	Declare @Total Decimal(18,2);

	select @ProductPrice = Price , @stock=Quantity 
	from Ajio_Products
	where @productId=ProductId;

	if (@Stock <@Quantity)
	begin 
		RAISERROR('Out of Stock ',16,1);
		return ;
	end 

	set @Total=@ProductPrice*@Quantity;

	if exists (select 1 from cart where CustomerID=@CustomerID and ProductId=@productId)
	begin
	update cart
	set Quantity=Quantity+@Quantity,
	TotalAmount  =TotalAmount+@Total
	where CustomerID =@CustomerID And ProductId=@productId;
	end
	else 
	begin 
		insert into cart (CustomerID,ProductId,Quantity,TotalAmount)
		values (@CustomerID,@productId,@Quantity,@Total);
		end ;
end;


	---Sp to update cart quantity 
create procedure UpdateQuantity
@cartId int,
@Quantity int	
as 
begin 

declare @ProductPrice Decimal(18,2);
declare @TotalAmount Decimal (18,2);

select @ProductPrice=price from Ajio_Products
where ProductId=(select ProductId from cart where CartID=@cartId);

	SET @TotalAmount = @ProductPrice * @Quantity;

	update cart 
	set Quantity=@Quantity,
	TotalAmount =@TotalAmount
	where CartID=@cartId;
	end ;


	--Empty cart 

	create procedure EmptyCart
	@CustomerID int 
	as 
	begin 
	delete from cart
	where CustomerID=@CustomerID;
	end ;

	--Update Stock after purchase 
	create procedure updateStock 
	@ProductId int ,
	@QuantityToUpdate int 
	as 
	begin 
	update Ajio_Products
	set Quantity=Quantity-@QuantityToUpdate
	where ProductId=@ProductId;
	end ;

	--CheckStock 
	create procedure CheckStock
	@ProductID int,
	@Quantity int 
	as 
	begin 
	Declare @AvailableStock int;

	select @AvailableStock=Quantity from Ajio_Products where ProductId=@ProductID;
	
	if @AvailableStock < @Quantity
	begin 
	RAISERROR('Out Of Stock',16,1);
	end 
	else 
	begin 
	print '';
	end 
end;

--Sp to upload products 
	create procedure AddProduct
		@productName Varchar(250),
		@Price Decimal (18,2),
		@Quantity int,
		@ImageUrl varchar(150)
		as 
		begin 
		insert into Ajio_Products(productName,price,Quantity,ImageUrl)values (@productName,@Price,@Quantity,@ImageUrl);
		end 

		drop procedure AddProduct
		--sp to get product



 CREATE PROCEDURE GetProducts
AS
BEGIN
    SELECT 
        ProductId,
        productName,
        price,
       ImageUrl
    FROM 
        Ajio_Products;
END;
exec GetProducts 
EXEC EmptyCart @CustomerID = 1

--Sp to remove specific item from cart 

create procedure RemoveItemFromCart
@CartID int 
as 

begin 
set nocount on;

if exists (select 1 from cart where  CartID = @CartID)
begin 
delete from cart where CartID =@CartID;
print 'Item Removed';
end 
else 
begin 
print 'Item not found to remove';
end 
end ; 


exec RemoveItemFromCart @CartID  = 160
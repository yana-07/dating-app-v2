namespace API.Helpers;

public class PagingParams
{
    public const int MaxPageSize = 50;

	private int _page = 1;

	public int Page 
	{ 
		get => _page; 
		init => _page = value < 1 ? 1 : value; 
	}

	private int _pageSize = 10;

	public int PageSize
	{
		get => _pageSize;
		init => _pageSize = value > MaxPageSize ? MaxPageSize : value;
	}
}

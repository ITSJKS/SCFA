def findDifference(N, nums):
    even_sum = 0
    odd_sum = 0

    for i in nums:
        if i % 2 == 0:
            even_sum += i
        else:
            odd_sum += i
        
    return even_sum - odd_sum
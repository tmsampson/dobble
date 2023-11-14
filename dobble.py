def dobble(p):
    cards = [[] for i in range(p**2 + p + 1)]
    cards[0].append(0)
    for i in range(p+1):
        for j in range(p):
            cards[1 + i*p + j].append(i)
            cards[i].append(1 + i*p + j)
    for i in range(p):
        for j in range(p):
            for k in range(p):
                cards[1 + p + i*p + k].append(1 + p + j*p + (i*j - k) % p)
    return cards

result = dobble(2)
print(result)